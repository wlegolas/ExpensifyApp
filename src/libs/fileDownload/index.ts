import * as ApiUtils from '@libs/ApiUtils';
import tryResolveUrlFromApiRoot from '@libs/tryResolveUrlFromApiRoot';
import * as Link from '@userActions/Link';
import CONST from '@src/CONST';
import * as FileUtils from './FileUtils';
import type {FileDownload} from './types';

/**
 * The function downloads an attachment on web/desktop platforms.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fileDownload: FileDownload = (url, fileName, successMessage = '', shouldOpenExternalLink = false, formData = undefined, requestType = 'get', onDownloadFailed?: () => void) => {
    const resolvedUrl = tryResolveUrlFromApiRoot(url);
    if (
        // we have two file download cases that we should allow 1. dowloading attachments 2. downloading Expensify package for Sage Intacct
        shouldOpenExternalLink ||
        (!resolvedUrl.startsWith(ApiUtils.getApiRoot()) &&
            !CONST.ATTACHMENT_LOCAL_URL_PREFIX.some((prefix) => resolvedUrl.startsWith(prefix)) &&
            url !== CONST.EXPENSIFY_PACKAGE_FOR_SAGE_INTACCT)
    ) {
        // Different origin URLs might pose a CORS issue during direct downloads.
        // Opening in a new tab avoids this limitation, letting the browser handle the download.
        Link.openExternalLink(url);
        return Promise.resolve();
    }

    const fetchOptions: RequestInit = {
        method: requestType,
        body: formData,
    };

    return fetch(url, fetchOptions)
        .then((response) => response.blob())
        .then((blob) => {
            // Create blob link to download
            const href = URL.createObjectURL(new Blob([blob]));

            // creating anchor tag to initiate download
            const link = document.createElement('a');

            // adding href to anchor
            link.href = href;
            link.style.display = 'none';
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Disabling this line for safeness as nullish coalescing works only if the value is undefined or null, and since fileName can be an empty string we want to default to `FileUtils.getFileName(url)`
            link.download = FileUtils.appendTimeToFileName(fileName || FileUtils.getFileName(url));

            // Append to html link element page
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            URL.revokeObjectURL(link.href);
            link.parentNode?.removeChild(link);
        })
        .catch(() => {
            if (onDownloadFailed) {
                onDownloadFailed();
            } else {
                // file could not be downloaded, open sourceURL in new tab
                Link.openExternalLink(url);
            }
        });
};

export default fileDownload;
