using System.Threading.Tasks;
using Domain;

namespace Application.Profiles
{
    public interface IProfileReader
    {
        Task<Profile> ReadProfile(string username);
    }
}