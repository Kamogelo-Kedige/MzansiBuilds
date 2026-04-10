# Project Profiling

## MzansiBuilds
A developer collaboration platform where users can create accounts, share projects they are working on, update milestones, comment on other developers' work, request collaboration, and appear on a celebration wall when projects are completed.

## Problem Statement
Developers need a simple platform where they can share what they are building, update progress, receive support, and celebrate completed work publicly.

## Objectives
- allow developers to create accounts
- allow users to create and update projects
- enable milestone tracking
- support comments and collaboration requests
- display completed projects in a celebration wall

## Target Users
- developers 

## Functional Requirements
- signup and login
- create project
- view projects
- add milestones
- comment on projects
- request collaboration
- mark project as complete
- view celebration wall

## Non-Functional Requirements
- security through authenticated access and row-level access control
- usability through simple interface
- maintainability through modular JavaScript structure
- portability through browser-based delivery

## Assumptions
- all users must authenticate before interacting with platform data
- one project belongs to one creator
- completed projects can be shown on the celebration wall by querying projects where is_complete = true

## Constraints
- short implementation timeline
- frontend built with plain HTML, CSS, and JavaScript
- backend implemented using Supabase

## MVP Scope
- authentication
- project CRUD
- comments
- collaboration requests
- milestones
- celebration wall
