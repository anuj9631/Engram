create extension if not exists vector;

create table public.memories (
  id           uuid        default gen_random_uuid() primary key,
  user_id      uuid        not null,
  title        text,
  content      text        not null,
  source_type  text        default 'note',
  tags         text[]      default '{}',
  embedding    vector(1536),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index on public.memories
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index memories_user_id_idx on public.memories(user_id);

alter table public.memories enable row level security;

create policy "own memories select" on public.memories for select using (auth.uid() = user_id);
create policy "own memories insert" on public.memories for insert with check (auth.uid() = user_id);
create policy "own memories update" on public.memories for update using (auth.uid() = user_id);
create policy "own memories delete" on public.memories for delete using (auth.uid() = user_id);

create or replace function match_memories(
  query_embedding  vector(1536),
  match_user_id    uuid,
  match_count      int   default 5,
  match_threshold  float default 0.4
)
returns table (
  id          uuid,
  title       text,
  content     text,
  tags        text[],
  source_type text,
  similarity  float,
  created_at  timestamptz
)
language sql stable as $$
  select
    m.id, m.title, m.content, m.tags, m.source_type,
    1 - (m.embedding <=> query_embedding) as similarity,
    m.created_at
  from public.memories m
  where
    m.user_id = match_user_id
    and m.embedding is not null
    and 1 - (m.embedding <=> query_embedding) > match_threshold
  order by m.embedding <=> query_embedding
  limit match_count;
$$;