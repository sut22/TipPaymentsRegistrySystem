export async function loadTemplate(path: string, templateId: string)
{
    const response = await fetch(path);

    const html = await response.text();

    const parser = new DOMParser();

    const doc = parser.parseFromString(html, "text/html");

    const template =
        doc.getElementById(templateId) as HTMLTemplateElement;

    return template.content.firstElementChild!.cloneNode(true) as HTMLElement;
}