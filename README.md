<div align="center">

# urlinks

![GitHub License](https://img.shields.io/github/license/0x4bs3nt/freetree)

<img width="1536" height="1024" alt="urlinks" src="https://github.com/user-attachments/assets/8166a089-8d2d-4b0f-bd7d-b3f0926cfa14" />

</div>

<br />

Completely free and fully open source link-in-bio tool. Like other link-in-bio tools,
but everything is free and open source, cause nobody is paying to display 5 links on a website.

<br />

> [!WARNING]
> This project is still under heavy development. Use in production at your own risk.

## Contributing

Contributions are always welcome!

See [CONTRIBUTING.md](https://github.com/0x4bs3nt/freetree/blob/dev/CONTRIBUTING.md) to get started.

Don't forget to follow the [Code of Conduct](https://github.com/0x4bs3nt/freetree/blob/dev/CODE_OF_CONDUCT.md)

## Running locally

This is a Django Rest Framework and Vite project. Unfortunately, we haven't had the time to add a Docker setup just
yet, so running the application locally means manually setting up Django and the Vite app. Luckily, this isn't hard.

### Django / Django Rest Framework

Using `uv` is a must for this project, we do not use other package managers here.

1. After pulling the project, head over to the `/backend/` directory, and run `uv sync`. This will initialize a virtual environment for the backend and install the dependencies.
2. Create a PostgreSQL database locally for freetree.
3. Fill out the `.env` according to the `.env.example` file, the `.env` should be located at the same place and level as the example one.
4. Migrate the tables by running `python manage.py migrate`.
5. Make sure pre commit hooks are installed by running `pre-commit install`.
6. Start the backend service with `python manage.py runserver`.

### React / Vite

Using `bun` is a must for this project, we do not use other package managers or runtimes here.

1. After pulling the project, head over to the `web` directory and run `bun install`. This will install all dependencies for the project.
2. Fill out the `.env` according to the `.env.example` file, the `.env` should be located at the same place and level as the example one.
3. Start the frontend service with `bun dev`.

## Useful URLs

After running the project, you can navigate to `/admin` on the backend for the Django admin panel with all registered models.
You might need to have a superuser for this, you can create one using `python manage.py createsuperuser`.

You can also navigate to `/api/docs` on the backend for the automatically generated Swagger UI.
