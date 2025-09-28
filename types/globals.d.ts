export {}
declare global{
    interface UserPublicMetadata{
        name: string | null;
        profile_img: string | null;
        email: string | null;
        username: string | null;
        repos: string[] | null;
        firstTimeUser?: boolean | null;
    }
}