from django.shortcuts import render
from .serializers import BlogSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import Blog
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
# Create your views here.

class BlogListCreateAPIView(ListCreateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

class BlogRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    
    def patch(self, request, *args, **kwargs):
        blog = self.get_object()

        if "likes" in request.data:
            blog.likes += 1

        if "dislikes" in request.data:
            blog.dislikes += 1

        blog.save()
        return Response(self.get_serializer(blog).data)