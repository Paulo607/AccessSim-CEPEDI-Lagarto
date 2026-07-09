import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User

# Tenta criar e se der erro, apenas ignora
try:
    if not User.objects.filter(username='admin').exists():
        user = User.objects.create_superuser('admin', 'admin@admin.com', 'Admin123456!')
        print('Superusuário criado com sucesso!')
    else:
        print('O usuário já existe.')
except Exception as e:
    print(f'Erro ao criar superusuário: {e}')