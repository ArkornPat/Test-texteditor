export function postProcessHtml(html: string): string {
    const processedHtml = html
        .replace(/<li><p>(.*?)<\/p><\/li>/gi, "<li>$1</li>")
        .replace(/<li><p>(.*?)<\/p><(\/?)(ol|li|ul)>/gi, "<li>$1<$2$3>")
        .replace(/<\/p><p>/gi, "<br/>")
        .replace(/<p>(.*?)<\/p>/gi, "$1<br/>")
        .replace(/<\/picture><\/li><li><p>/gi, "</picture><br/></li><li>")
        .replace(/<\/p><picture style="padding-top: 2rem;" class="site-img-wrapper">/gi, "<br/><picture style=\"padding-top: 2rem;\" class=\"site-img-wrapper\">")
        .replace(/<br\/><\/li><li><p>/gi, "<br/></li><li>")
        .replace(/<\/p><br\/><picture style="padding-top: 2rem;" class="site-img-wrapper">/gi, "<br/><picture style=\"padding-top: 2rem;\" class=\"site-img-wrapper\">")
        .replace(/<\/picture><\/li><li><strong>/gi, "</picture><br/></li><li><strong>");
    return processedHtml;
}

export const cleanHTML = (content: string): string => {
    if (!content) return '';
    return content
        .replaceAll(/<li><p>(.*?)<\/p><(\/?)(ol|li|ul)>/gi, "<li>$1<$2$3>")
        .replaceAll(/<li><p>(.*?)<\/p><\/li>/gi, "<li>$1</li>")
        .replaceAll(/<p>(.*?)<\/p>/gi, "$1")
        .replaceAll(/<p>\s*<\/p>/gi, "")
        .replaceAll(/<p><p>(.*?)<\/p><\/p>/gi, "$1")
        .replaceAll(/<strong>\*\*\*(.*?)\*\*\*<\/strong>/gi, "<strong>$1</strong>")
        .replace(/(schedule-fixture)(-fixture)*/g, "schedule-fixture");
};