import os
import datetime
from pathlib import Path
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'cfm(&*18a%r4pw90n&d2zmpb5ufw2)axn)4llfgapi02&kd5(v'
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'accounts',
    'code_running',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'server.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'server.wsgi.application'

DATABASE_URL = os.environ.get(
    "DATABASE_URL", "postgres://dsserver:secretpassword@localhost:9932/dsserver"
)
DATABASES = {"default": dj_database_url.parse(DATABASE_URL)}

# Cache
REDIS_CACHE_URL = os.environ.get("REDIS_CACHE_URL", "redis://localhost:6379/2")
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_CACHE_URL,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "IGNORE_EXCEPTIONS": True,
        },
    }
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [],
    'UNAUTHENTICATED_USER': None,
}

# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Limits

CHARFIELD_MAX = 250
TEXTFIELD_MAX = 350
LONG_TEXTFIELD_MAX = 600
URLFIELD_MAX = 2083
VARIABLES_MAX_LENGTH_CHARS = 109500

CONNECTIONS = {
    "giveme_expiration_seconds": 60,
    "messages": {
        "ttl": datetime.timedelta(days=7),
        "types": {
            "error/invalid_type": "code_running.handlers.invalid_type_handler",
            "error/invalid_message": "code_running.handlers.invalid_message_handler",
            "error/throttle": None,
            "post/setup": "code_running.handlers.get_connect_data",
            "post/reset": "code_running.handlers.reset",
            "error/containers/validation": None,
            "error/containers/permissions": None,
            "error/containers/runtime": None,
            "push/legacy_status": None,
            "error/code/validation": None,
            "error/run/validation": None,
            "error/run/permissions": None,
            "error/run/runtime": None,
        },
    },
}

SAVE_RECEIVED_MESSAGES = True

TIME_ZONE = 'UTC'

USE_TZ = True


STATIC_URL = '/static/'
