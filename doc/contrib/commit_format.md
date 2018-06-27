## Commit format
[Semantic release](https://github.com/semantic-release/semantic-release) is used in this project, so to trigger new release you should add specific format into your commit messages and new release will be triggered when PR is merged.

#### Used formatter
[Commit analyzer wildcard](https://github.com/karelhala/commit-analyzer-wildcard) is used for parsing commit messages so to trigger new release add one of these strings into your commit and new release is triggered
* Major - `<?.?.x>`
* Minor - `<?.x.x>` or `<?.x.?>`
* Bug - `<x.x.x>` or `<x.x.?>` or `<x.?.x>` or `<x.?.?>`
* No release - `<no>`