using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Mvc;

namespace Pronto.Middleware.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TestAuthController : ControllerBase
    {
        [HttpGet("login")]
        public IActionResult TestLogin()
        {
            var token = "DkAXUuJR4rJxekMDAHUotMy8k5EbxD~fvV01qR04SjhHyJ7CiR585EuDbBz9t8Ah"; 
            return Ok(new { Token = token });
        }

        [HttpGet("logout")]
        public IActionResult TestLogout()
        {
            return Ok();
        }
    }
}