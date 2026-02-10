from django.urls import path
from .views import BlogListCreateAPIView, BlogRetrieveUpdateDestroyAPIView

urlpatterns = [
    path('', BlogListCreateAPIView.as_view(), name='blog-list-create'),
    path('<int:pk>/', BlogRetrieveUpdateDestroyAPIView.as_view(), name='blog-retrieve-update-destroy'),
]