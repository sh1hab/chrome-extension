async function fillMarketplaceForm(product) {
    try {

        const labelElement = document.querySelector('label[aria-label="Titre"]');
        if (labelElement) {
            const inputElement = labelElement.querySelector('input[type="text"]');
            if (inputElement) {
                inputElement.value = product.title;
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                inputElement.dispatchEvent(new Event('change', { bubbles: true }));

            } else {
                console.error("Input not found within label");
            }
        } else {
            console.error("Label not found");
        }

        const price = document.querySelector('label[aria-label="Prix"]');
        if (price) {
            const inputElement = price.querySelector('input[type="text"]');
            if (inputElement) {
                inputElement.value = product.price;
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                inputElement.dispatchEvent(new Event('change', { bubbles: true }));

            } else {
                console.error("Input not found within label");
            }
        } else {
            console.error("Label not found");
        }

        const inputElement = document.querySelector('input[type="file"]');
        if (inputElement) {

            const dataTransfer = new DataTransfer();
            const file = new File([await fetch(product.image).then(res => res.blob())], 'image.jpg', { type: 'image/jpeg' });

            dataTransfer.items.add(file);

            inputElement.files = dataTransfer.files;

            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            inputElement.dispatchEvent(new Event('change', { bubbles: true }));

        } else {
            console.error("File input not found.");
        }

        const conditionDropdown = document.querySelector('label[aria-label="État"]');
        if (conditionDropdown) {

            conditionDropdown.click();

            document.querySelectorAll('div[role="option"]')[0].click();
        } else {
            console.log("Label not found.");
        }

        const categoryDropDown = document.querySelector('label[aria-label="Catégorie"]');
        if (categoryDropDown) {

            categoryDropDown.click();

            setTimeout(() => {
                const desiredCondition = Array.from(document.querySelectorAll('span'))
                    .find(span => span.textContent.trim() === 'Outils');

                desiredCondition.click();

            }, 1000);
        } else {
            console.log("Label not found.");
        }

        const nextToSubmitButton = document.querySelector('div[aria-label="Suivant"]');

        if (nextToSubmitButton) {
            setTimeout(() => {
                nextToSubmitButton.click();
                setTimeout(() => {
                    const publishToFacebookButton = document.querySelector('div[aria-label="Publier"]');

                    publishToFacebookButton.click();
                }, 1000);
            }, 1000);
        } else {
            console.error("Button div not found");
        }

        return true;
    } catch (error) {
        console.error('Error filling form:', error);
        return false;
        // alert('Error: Please make sure are logged in to Facebook French Marketplace and try again.');
    }

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === 'fillForm') {
        console.log('Filling form with product:', request)
        fillMarketplaceForm(request.product).then(success => {
            sendResponse({ success: success });
        });
        return true;
    }
});


