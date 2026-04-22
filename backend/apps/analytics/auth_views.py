from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

@api_view(["POST"])
def signup(request):
    data = request.data
    name = data.get("name", "")
    email = data.get("email", "")
    password = data.get("password", "")
    
    if not email or "@" not in email:
        return Response({"error": "Invalid email"}, status=400)
    if not password:
        return Response({"error": "Wrong password"}, status=400)
        
    if User.objects.filter(username=email).exists():
        return Response({"error": "User already exists"}, status=400)
        
    try:
        User.objects.create_user(username=email, email=email, password=password, first_name=name)
        return Response({"message": "Signup successful"})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["POST"])
def login_view(request):
    data = request.data
    email = data.get("email", "")
    password = data.get("password", "")
    
    user = authenticate(username=email, password=password)
    
    if user is not None:
        return Response({
            "message": "Login successful", 
            "user": {"name": user.first_name, "email": user.email}
        })
    else:
        
        if not User.objects.filter(username=email).exists():
            return Response({"error": "User does not exist"}, status=404)
        return Response({"error": "Wrong password"}, status=400)
