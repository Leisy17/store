from rest_framework import serializers
from .models import Product, Stock
from warehouse.serializers import WarehouseSerializer

class ProductSerializer(serializers.ModelSerializer):
    stock = WarehouseSerializer(read_only=True)  # Custom field declared

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'warehouse', 'stock']  # Add 'stock' here

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['id', 'product', 'amount', 'warehouse']

    def get_stock(self, obj):
        # Example logic to fetch stock data
        stock = Stock.objects.filter(product=obj).first()
        return StockSerializer(stock).data if stock else None