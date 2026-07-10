import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User

username = os.environ.get('ADMIN_USERNAME', 'admin')
password = os.environ.get('ADMIN_PASSWORD')
email = os.environ.get('ADMIN_EMAIL', 'admin@admin.com')

if not password:
    print('ADMIN_PASSWORD não definida, pulando criação/atualização do superusuário.')
else:
    try:
        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': email, 'is_staff': True, 'is_superuser': True}
        )
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save()

        if created:
            print('Superusuário criado com sucesso!')
        else:
            print('Superusuário existente atualizado com nova senha!')
    except Exception as e:
        print(f'Erro ao criar/atualizar superusuário: {e}')