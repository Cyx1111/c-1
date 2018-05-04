using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _04_shangji1
{
    class PM
    {
         public string Id { get; set; }
         public string Name { get; set; }
         public int Age{ get; set; }
         public string Sex { get; set; }
         public int Wh { get; set; }
        public PM (string id,string name,int age,string sex,int wh)
        {
            this.Id = id;
            this.Name = name;
            this.Age = age;
            this.Sex = sex;
            this.Wh = wh;
        }
        public void Sayhi() {

            Console.WriteLine("工号是：{0}姓名是：{1}年龄：{2}性别：{3}分数：{4}",this.Id,this.Name,this.Age,this.Sex,this.Wh);
        }
    }
}
