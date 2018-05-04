using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace 影院售票系统
{
    class Scheduleltem//每天放映的计划
    {
        public string  Time { get; set; }//时间
        public Movie Movie { get; set; }//每天放的电影属性
    }
}
