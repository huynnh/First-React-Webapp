# Generated by Django 5.2 on 2025-05-17 10:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calendarsync', '0008_calendarevent_last_synced_at'),
        ('tasks', '0003_task_external_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='external_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='tasks', to='calendarsync.calendarevent'),
        ),
    ]
