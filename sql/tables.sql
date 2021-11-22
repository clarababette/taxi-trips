CREATE TABLE region (
  id serial primary key,
  name text unique not null
);

CREATE TABLE taxi (
  id serial primary key,
  reg_number text unique not null,
  region_id int,
  foreign key (region_id) references region(id)
);

CREATE TABLE route (
  id serial primary key,
  name text unique not null,
  cost decimal(10,2),
  region_id int,
  foreign key (region_id) references region(id)
);

CREATE TABLE trip (
  id serial primary key,
  date_time timestamp,
  taxi_id int,
  route_id int,
  foreign key (taxi_id) references taxi(id),
  foreign key (route_id) references route(id)
);

