from django.db import models
from warehouse.models import Warehouse


class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE,
                                  related_name='products')

    def __str__(self):
        return self.name


class Stock(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    amount = models.IntegerField()
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.product.name} - {self.amount} in {self.warehouse.name}"
