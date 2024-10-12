# ventas/models.py
from django.db import models
from customers.models import Customer
from stock.models import Product
from users.models import CustomUser


class Sale(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    amount = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (f"Sale of {self.amount} {self.product.name} to "
                f"{self.customer.name} by {self.user.username} at {self.date}")
