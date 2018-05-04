using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GongZuo
{
  public   class PM : Employee
    {
        private int YearOfExperience;  //多年经验

        public int YearOfExperience1
        {
            get { return YearOfExperience; }
            set { YearOfExperience = value; }
        }
        public string DoWork()
        {
            string message = this.Name1 + ":管理员员工完成工作内容";
            return message;
        }
        public PM() { }
        public PM(string id, string name, int age, Gender gender, int YearOfExperience,
            List<Job> list) : base(id, age, name, gender, list)
        {
            this.YearOfExperience1 = YearOfExperience;
        }
    }
}
