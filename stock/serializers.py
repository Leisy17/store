from rest_framework import serializers
from .models import Product, Stock
from warehouse.serializers import WarehouseSerializer


class ProductSerializer(serializers.ModelSerializer):
    stock = WarehouseSerializer(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'warehouse']


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['id', 'product', 'amount', 'warehouse']
