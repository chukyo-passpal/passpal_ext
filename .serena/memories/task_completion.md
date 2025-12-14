# Task Completion Checklist

After completing a coding task, perform the following steps to ensure quality and stability:

1.  **Linting**: Run `bun run lint` to catch and fix any linting errors.
2.  **Route Generation**: If you modified any files in `action/routes`, run `bun run gen-routes` to update the route
    tree.
3.  **Build**: Run `bun run build` to verify that the project builds successfully without errors.
4.  **Verification**: If possible, verify the changes in the context of the browser extension (though this might be
    limited in the CLI environment).

**Note**: Since this is a browser extension, ensure that `manifest.json` is updated if you add new content scripts,
permissions, or assets.
