drop policy "users own feedback" on feedback;
create policy "users own feedback" on feedback
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
