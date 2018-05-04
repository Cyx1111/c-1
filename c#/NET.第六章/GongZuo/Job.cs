using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GongZuo
{
    public class Job : Employee
    {
        public string Name { get; set; }    //姓名
        public string Description { get; set; }   //描述
        public Job(string name,string description)
        {
            this.Name = name;
            this.Description = description;

        }
    }
}
