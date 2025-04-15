#!/user/bin/env ptython3
import psycopg2

DB_HOST = "example_host"
DB_NAME = "example_name"
DB_USER = "example_user"
DB_PASSWORD = "example password"


def connect_to_db() -> psycopg2.extensions.connection:
    """Establises a connection to the PostgreSQL database."""
    try:
        connection = psycopg2.connect(
            host=DB_HOST,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        return connection
    except psycopg2.Error as e:
        raise ConnectionError(
            f"Failed to connect to the PostgreSQL database: {e}"
        )
