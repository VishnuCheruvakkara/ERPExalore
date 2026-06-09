from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

# Create your views here.

class LoginView(APIView):

    def post(self, request):

        user = authenticate(
            username=request.data.get("email"),
            password=request.data.get("password")
        )

        if not user:
            return Response({"error": "Invalid credentials"}, status=401)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})