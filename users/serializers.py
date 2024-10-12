from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class AuthTokenSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = CustomUser.objects.filter(username=attrs['username']).first()
        if user is None:
            raise serializers.ValidationError("Usuario no encontrado.")
        if not user.check_password(attrs['password']):
            raise serializers.ValidationError("Contraseña incorrecta.")
        attrs['user'] = user
        return attrs
