namespace backend.DTOs
{
    public class Response<T>(int code, string msg, T data)
    {
        public int Code { get; set; } = code;
        public string Msg { get; set; } = msg;
        public T Data { get; set; } = data;
    }
}
