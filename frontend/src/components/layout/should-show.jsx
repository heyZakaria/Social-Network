export default function shouldShowNav(pathname) {
    const allowedPaths = [
        '/',
        '/events',
        '/friends',
        '/notifications',
        '/login',
        '/register',
        '/groups',
        '/groups/CreateGroup',
    ];

    const isDynamicMatch =
        /^\/(profile|group)\/[a-zA-Z0-9-]+$/.test(pathname);

    return (
        (allowedPaths.includes(pathname) || isDynamicMatch) &&
        pathname !== '/not-found'
    );
}
