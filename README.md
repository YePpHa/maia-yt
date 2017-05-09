# maia-yt

[![Greenkeeper badge](https://badges.greenkeeper.io/YePpHa/maia-yt.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/YePpHa/maia-yt.svg?branch=master)](https://travis-ci.org/YePpHa/maia-yt)

Currently codenamed maia-yt is a userscript (and browser extension) that
enhances the user's experience on YouTube.

# What's in this at the moment
It will only work for the new YouTube layout and will only repeat a video. A lot
of the core functionality of this project hasn't been finalized yet.

# Current plan moving forward
I will at some point also add these as issues and create proper milestones on
GitHub.

## Alpha milestone (current)
Before anything else, the groundwork for this project needs to be completed.
Here's a simplistic overview of what needs to be done:
- Only inject scripts into the page that is necessary for it to control the
  player and other essential things. We don't want to degrade the performance as
  in the old YouTube Center.
- Player controller that will dispatch player events (play, pause, end, video
  quality change, etc.).
- Simple functionality like the repeat functionality. This depends on the end
  video event.
- Support for the new YouTube layout (including the old one)
- (Maybe UI components on the page - only for testing)

## Beta milestone
In this stage a lot of missing things in the first milestone will be added. This
will be the first usable version.
- Implement settings UI. I might decide on a whole page/website for the
  settings.
- Implement a lot of basic features (haven't decided on what to add yet).
- Add Chrome extension, Edge extension, Firefox extension, Maxthon extension and
  Safari extension (if I'm missing some create an issue about it and I will
  consider adding it to the list).
- Implement an i18n system.
- ...

## Release milestone
Not sure what should be in this milestone yet.
