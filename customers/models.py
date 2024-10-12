from django.db import models


class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    document_number = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.name}, {self.document_number}"
