{
  description = "urlinks - Full-stack development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        # Helper scripts
        scripts = {
          pc-up = pkgs.writeShellScriptBin "pc-up" ''
            exec ${pkgs.process-compose}/bin/process-compose up "$@"
          '';

          pc-down = pkgs.writeShellScriptBin "pc-down" ''
            exec ${pkgs.process-compose}/bin/process-compose down "$@"
          '';

          db-psql = pkgs.writeShellScriptBin "db-psql" ''
            PGPASSWORD="$POSTGRES_PASSWORD" exec ${pkgs.postgresql_16}/bin/psql \
              -h "$POSTGRES_HOST" \
              -p "$POSTGRES_PORT" \
              -U "$POSTGRES_USER" \
              -d "$POSTGRES_DB" \
              "$@"
          '';

          db-reset = pkgs.writeShellScriptBin "db-reset" ''
            set -e
            echo "Resetting database..."

            # Drop and recreate database
            PGPASSWORD="$POSTGRES_PASSWORD" ${pkgs.postgresql_16}/bin/psql \
              -h "$POSTGRES_HOST" \
              -p "$POSTGRES_PORT" \
              -U "$POSTGRES_USER" \
              -d postgres \
              -c "DROP DATABASE IF EXISTS $POSTGRES_DB;"

            PGPASSWORD="$POSTGRES_PASSWORD" ${pkgs.postgresql_16}/bin/psql \
              -h "$POSTGRES_HOST" \
              -p "$POSTGRES_PORT" \
              -U "$POSTGRES_USER" \
              -d postgres \
              -c "CREATE DATABASE $POSTGRES_DB OWNER $POSTGRES_USER;"

            echo "Database reset complete!"
          '';
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs =
            with pkgs;
            [
              python313
              uv
              bun
              nodejs_22
              postgresql_16
              process-compose
              git
              jq
              curl
              httpie
              ruff
            ]
            ++ (builtins.attrValues scripts);

          # Environment variables - only non-secret settings here
          # All app-specific config comes from backend/.env and web/.env
          DEVENV_ROOT = builtins.toString ./.;
          UV_PYTHON_PREFERENCE = "system";

          shellHook = ''
            export DEVENV_ROOT="$(pwd)"

            # Create data directory
            mkdir -p .data

            # Activate backend virtualenv if it exists
            if [ -f "$DEVENV_ROOT/backend/.venv/bin/activate" ]; then
              source "$DEVENV_ROOT/backend/.venv/bin/activate"
            fi

            # Source .env files from backend and web directories
            missing_env=0
            if [ -f "$DEVENV_ROOT/backend/.env" ]; then
              set -a
              source "$DEVENV_ROOT/backend/.env"
              set +a
            else
              echo "⚠  Missing backend/.env - copy from backend/.env.example"
              missing_env=1
            fi

            if [ -f "$DEVENV_ROOT/web/.env" ]; then
              set -a
              source "$DEVENV_ROOT/web/.env"
              set +a
            else
              echo "⚠  Missing web/.env - copy from web/.env.example"
              missing_env=1
            fi

            echo ""
            echo "══════════════════════════════════════════════════════════"
            echo "  urlinks Development Environment"
            echo "══════════════════════════════════════════════════════════"
            echo ""
            echo "  Services:"
            echo "    pc-up             Start all services (postgres, backend, frontend)"
            echo "    pc-down           Stop all services"
            echo ""
            echo "  Database:"
            echo "    db-psql           Connect to database via psql"
            echo "    db-reset          Drop and recreate database"
            echo ""
            echo "  First-time setup:"
            echo "    1. cd backend && uv sync      # Install Python deps"
            echo "    2. cd web && bun install      # Install frontend deps"
            echo "    3. pc-up                      # Start everything!"
            echo ""
            echo "══════════════════════════════════════════════════════════"
            echo ""
          '';
        };
      }
    );
}
