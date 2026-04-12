
-- PROFILE POLICIES

create policy "Users can view all profiles"
on public.profiles
for select
to authenticated
using (true);

create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);



-- PROJECTS POLICIES

create policy "projects_select_authenticated"
on public.projects
for select
to authenticated
using (true);

create policy "projects_insert_own"
on public.projects
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "projects_update_own"
on public.projects
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "projects_delete_own"
on public.projects
for delete
to authenticated
using (auth.uid() = user_id);

-- MILESTONES POLICIES

create policy "milestones_select_authenticated"
on public.milestones
for select
to authenticated
using (true);

create policy "milestones_insert_project_owner"
on public.milestones
for insert
to authenticated
with check (
  exists (
    select 1
    from public.projects p
    where p.project_id = milestones.project_id
      and p.user_id = auth.uid()
  )
);

create policy "milestones_update_project_owner"
on public.milestones
for update
to authenticated
using (
  exists (
    select 1
    from public.projects p
    where p.project_id = milestones.project_id
      and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.projects p
    where p.project_id = milestones.project_id
      and p.user_id = auth.uid()
  )
);

create policy "milestones_delete_project_owner"
on public.milestones
for delete
to authenticated
using (
  exists (
    select 1
    from public.projects p
    where p.project_id = milestones.project_id
      and p.user_id = auth.uid()
  )
);


-- COMMENTS POLICIES

create policy "comments_select_authenticated"
on public.comments
for select
to authenticated
using (true);

create policy "comments_insert_own"
on public.comments
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "comments_update_own"
on public.comments
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "comments_delete_own"
on public.comments
for delete
to authenticated
using (auth.uid() = user_id);


-- COLLABORATIONS POLICIES

create policy "collaborations_select_authenticated"
on public.collaborations
for select
to authenticated
using (true);

create policy "collaborations_insert_own"
on public.collaborations
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "collaborations_update_own"
on public.collaborations
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "collaborations_delete_own"
on public.collaborations
for delete
to authenticated
using (auth.uid() = user_id);