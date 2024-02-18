# dotpal-app

# Backend start up instruction

## Running on local python environment
If you already have python installed, simply go to the directly `/backend` with the following command and run `app.py`. 

```bash
cd backend
python app.py
```

Note that you need to install the modules listed in `requirements.txt` by the following command. 

```bash
pip install -r requirements.txt
```

# Swagger UI
You can check the responses of the endpoints directly on SwaggerUI (without any frontend).
Access link:

<a>http://0.0.0.0:8000/api/docs</a>

Not that first you need to get the server running. (i.e., after running `app.py`)

## Trying endpoints on Browser

1. You'll see the landing page like this.

![](images_readme/1.png)

2. Expand the section for Read Users endpoint.
   
![](images_readme/2.png)

3. Click `Try it out` button.

![](images_readme/3.png)

4. Call the endpoint by clicking `Execute` button, and then you will see the response from it.(JSON)
   
![](images_readme/4.png)
