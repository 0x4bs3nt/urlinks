import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: 'Is urlinks really free?',
        answer: 'Yes, absolutely! Urlinks is completely free and open source. No hidden fees, no premium plans, no paywalls. Everything you see is available to everyone.',
    },
    {
        question: 'How does urlinks compare to Linktree?',
        answer: "Urlinks offers all the core features of Linktree without any cost. You get unlimited links, custom themes, analytics, and more. Since it's open source, you can even host it yourself if you prefer complete control.",
    },
    {
        question: 'Can I use a custom domain?',
        answer: 'Yes! You can connect your own custom domain to your urlinks page, making it truly yours.',
    },
    {
        question: 'Is my data safe?',
        answer: "Your privacy is our priority. Urlinks is open source, meaning anyone can audit the code. We don't sell your data or track you beyond basic analytics that you control.",
    },
    {
        question: 'How can I support the project?',
        answer: 'While urlinks is free to use, running the infrastructure and development takes resources. You can support us through donations on our support page, contribute code on GitHub, or spread the word!',
    },
    {
        question: 'Can I self-host urlinks?',
        answer: "Absolutely! As an open source project, you're free to host urlinks on your own infrastructure. Check out our GitHub repository for deployment instructions.",
    },
];

export function FAQ() {
    return (
        <section id="faq" className="px-4 py-24">
            <div className="mx-auto max-w-4xl">
                <div className="space-y-4 text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Frequently asked questions</h2>
                    <p className="text-xl text-muted-foreground">Got questions? We've got answers.</p>
                </div>
                <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300"
                >
                    {faqs.map((faq, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-lg px-6 bg-card">
                            <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline items-center">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
