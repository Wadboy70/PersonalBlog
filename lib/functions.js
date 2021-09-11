import GhostContentAPI from '@tryghost/content-api'

// Create API instance with site credentials
const api = new GhostContentAPI({
    url: process.env.GHOST_URL,
    key: process.env.GHOST_API_KEY,
    version: 'v4',
});

export async function getPosts() {
    return await api.posts
        .browse({
            limit: "all",
        })
        .catch((err) => {
            console.error(err);
        });
}

export async function getSinglePost(postSlug) {
    return await api.posts
        .read({
            slug: postSlug,
        })
        .catch((err) => {
            console.error(err);
        });
}