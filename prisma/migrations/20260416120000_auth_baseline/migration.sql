create table if not exists "auth_users" (
  "id" text not null,
  "name" text not null,
  "email" text not null,
  "emailVerified" boolean not null default false,
  "image" text,
  "createdAt" timestamptz not null default current_timestamp,
  "updatedAt" timestamptz not null default current_timestamp,
  constraint "auth_users_pkey" primary key ("id")
);

create unique index if not exists "auth_users_email_key"
  on "auth_users" ("email");

create table if not exists "auth_sessions" (
  "id" text not null,
  "expiresAt" timestamptz not null,
  "token" text not null,
  "createdAt" timestamptz not null default current_timestamp,
  "updatedAt" timestamptz not null default current_timestamp,
  "ipAddress" text,
  "userAgent" text,
  "userId" text not null,
  constraint "auth_sessions_pkey" primary key ("id"),
  constraint "auth_sessions_userId_fkey"
    foreign key ("userId") references "auth_users" ("id") on delete cascade on update cascade
);

create unique index if not exists "auth_sessions_token_key"
  on "auth_sessions" ("token");

create index if not exists "auth_sessions_userId_idx"
  on "auth_sessions" ("userId");

create table if not exists "auth_accounts" (
  "id" text not null,
  "accountId" text not null,
  "providerId" text not null,
  "userId" text not null,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  "scope" text,
  "password" text,
  "createdAt" timestamptz not null default current_timestamp,
  "updatedAt" timestamptz not null default current_timestamp,
  constraint "auth_accounts_pkey" primary key ("id"),
  constraint "auth_accounts_userId_fkey"
    foreign key ("userId") references "auth_users" ("id") on delete cascade on update cascade
);

create index if not exists "auth_accounts_userId_idx"
  on "auth_accounts" ("userId");

create table if not exists "auth_verifications" (
  "id" text not null,
  "identifier" text not null,
  "value" text not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default current_timestamp,
  "updatedAt" timestamptz not null default current_timestamp,
  constraint "auth_verifications_pkey" primary key ("id")
);

create index if not exists "auth_verifications_identifier_idx"
  on "auth_verifications" ("identifier");

create table if not exists "rateLimit" (
  "id" text not null,
  "key" text not null,
  "count" integer not null,
  "lastRequest" bigint not null,
  constraint "rateLimit_pkey" primary key ("id")
);

create unique index if not exists "rateLimit_key_key"
  on "rateLimit" ("key");
