import { SELECTORS } from "./utils/constants";
import { RedirectManager } from "./utils/redirect";

window.addEventListener("load", async () => {
    const brandIcon = document.querySelector(SELECTORS.MANABO.BLAND_ICON) as HTMLElement | null;

    if (brandIcon) {
        brandIcon.addEventListener("click", () => {
            RedirectManager.redirectToManaboAuth();
        });
        brandIcon.style.cursor = "pointer"; // クリック可能であることを示すためにカーソルを変更
    }
});
