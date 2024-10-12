from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Sale
from .serializers import SaleSerializer
from stock.models import Stock
from rest_framework.permissions import IsAuthenticated


class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        producto_id = request.data.get('producto')
        cantidad = request.data.get('cantidad')

        try:
            inventario = Stock.objects.get(producto_id=producto_id)
            if inventario.amount < cantidad:
                return Response(
                    {'error': 'Stock insuficiente'},
                    status=status.HTTP_400_BAD_REQUEST)

            inventario.amount -= cantidad
            inventario.save()

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Stock.DoesNotExist:
            return Response(
                {'error': 'Producto no encontrado en el inventario'},
                status=status.HTTP_404_NOT_FOUND)
