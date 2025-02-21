using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using backend.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Note: will be /api/user in this case
    public class UserController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

        [HttpGet("me")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<UserDetailDto>))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetOrCreateUser()
        {
            try
            {
                // Fetch the user details from the service
                var userDetail = await _userService.GetOrCreateUserAsync(User);

                // Map the UserDetail model to a UserDetailDto
                var userDetailDto = new UserDetailDto
                {
                    UserId = userDetail.UserId,
                    UserName = userDetail.UserName,
                    UserPointsBalance = userDetail.UserPointsBalance,
                    UserPermission = userDetail.UserPermission,
                    UserStatus = userDetail.UserStatus
                };
                var ret = new Response<UserDetailDto>(0, "Success", userDetailDto);
                return Ok(ret);
            }
            catch (Exception ex)
            {
                return Unauthorized(ex.Message);
            }
        }
    }
}
