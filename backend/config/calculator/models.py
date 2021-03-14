from django.db import models

# Create your models here.

class Combinations(models.Model):
    name = models.CharField(max_length=255)
    graphic_card = models.CharField(max_length=255)
    processor = models.CharField(max_length=255)
    ram_memory = models.CharField(max_length=255)
    motherboard = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'combinations'

class FpsAverages(models.Model):
    fps_average = models.IntegerField()
    id_combination = models.ForeignKey(Combinations, models.DO_NOTHING, db_column='id_combination')
    id_game = models.ForeignKey('Games', models.DO_NOTHING, db_column='id_game')

    class Meta:
        managed = False
        db_table = 'fps_averages'

class Games(models.Model):
    name = models.CharField(max_length=255)
    url_logo = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'games'
        
class KnexMigrations(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    batch = models.IntegerField(blank=True, null=True)
    migration_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'knex_migrations'


class KnexMigrationsLock(models.Model):
    index = models.AutoField(primary_key=True)
    is_locked = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'knex_migrations_lock'


class Users(models.Model):
    username = models.CharField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
    email = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'users'
