# WX-E

## Getting Started

Install the dependencies

```bash
yarn
```

Set the environment variables

```bash
cp .env.example .env
```

Running the boilerplate:

```bash
yarn dev
```

## Configuration

Variables for the environment

| Option             | Description                         |
| ------------------ | ----------------------------------- |
| SERVER_PORT        | Port the server will run on         |
| NODE_ENV           | development or production           |
| SERVER_JWT         | true or false                       |
| SERVER_JWT_SECRET  | JWT secret                          |
| SERVER_JWT_TIMEOUT | JWT duration time                   |
| DB_DIALECT         | "mysql", "postgresql", among others |
| DB_HOST            | Database host                       |
| DB_USER            | Database username                   |
| DB_PASS            | Database password                   |
| DB_NAME            | Database name                       |
| AWS_KEYID          | Access key ID                       |
| AWS_SECRETKEY      | User secret key                     |
| AWS_BUCKET         | Bucket name                         |

## Commands for sequelize

```bash
# Creates the database
yarn sequelize db:create

# Drops the database
yarn sequelize db:drop

# Load migrations
yarn sequelize db:migrate

# Undo migrations

yarn sequelize db:migrate:undo:all
# Load seeders
yarn sequelize db:seed:all
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
