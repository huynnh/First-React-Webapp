# Generated by Django 5.2 on 2025-05-18 10:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0003_event_external_id_event_external_provider_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='event',
            name='task_id',
        ),
        migrations.AddField(
            model_name='event',
            name='title',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
