import { RouteLocationNormalized } from 'vue-router';
import PasteRepository from '@/services/repository/PasteRepository.ts';
import { useAuth } from '@/store/authStore.ts';
import { PasteVisibility } from '@/models/paste/PasteVisibility.ts';
import { Paste } from '@/models/paste/Paste.ts';

const hasAccess = (paste: Paste, location: RouteLocationNormalized): boolean => {
    // paste is invalid
    if (!paste) {
        return false;
    }
    // user is an admin, so has access regardless
    if (useAuth().user?.role === 'admin') {
        return true;
    }

    const isEditing = location.matched.find((r) => {
        return r.name === 'paste-pasteId-edit';
    });

    // paste is from an unknown author or doesn't match the logged-in user
    if (isEditing && (!paste.creator || paste.creator !== useAuth().user?.id)) {
        return false;
    }
    // paste is public or belongs to the logged-in user
    return paste.visibility !== PasteVisibility.PRIVATE || paste.creator === useAuth().user?.id;
};

export default async function (to: RouteLocationNormalized) {
    console.log('paste middleware');
    const pasteId = to.params.pasteId as string;
    if (!pasteId) {
        return;
    }

    console.log('pasteId', pasteId);

    try {
        const paste = await PasteRepository.fetchPaste(pasteId);
        console.log('paste', paste);

        if (!hasAccess(paste, to)) {
            console.log('redirecting to paste home page');
            return navigateTo('/paste', {
                redirectCode: 301,
                replace: true
            });
        }
    } catch (e) {
        console.log('paste middleware error');
        return navigateTo('/paste', {
            redirectCode: 301,
            replace: true
        });
    }
};
