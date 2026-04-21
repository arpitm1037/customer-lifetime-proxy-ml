from django.apps import AppConfig


class AnalyticsConfig(AppConfig):
    name = "apps.analytics"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):
       
        from django.db.backends.signals import connection_created

        def _sqlite_pragmas(sender, connection, **kwargs):
            if connection.vendor != "sqlite":
                return
            with connection.cursor() as cursor:
                cursor.execute("PRAGMA journal_mode=WAL;")
                cursor.execute("PRAGMA synchronous=NORMAL;")

        connection_created.connect(_sqlite_pragmas, dispatch_uid="analytics_sqlite_wal")