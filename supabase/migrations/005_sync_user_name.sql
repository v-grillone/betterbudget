create or replace function public.handle_user_updated()
returns trigger as $$
begin
  if new.raw_user_meta_data->>'name' is distinct from old.raw_user_meta_data->>'name' then
    update public.users
    set name = new.raw_user_meta_data->>'name'
    where user_id = new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_updated
  after update on auth.users
  for each row execute function public.handle_user_updated();
