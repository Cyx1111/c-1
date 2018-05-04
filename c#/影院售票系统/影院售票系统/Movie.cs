using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace 影院售票系统
{
    class Movie//电影类
    {
        public  string  MovieName { get; set; }//电影名字
        public string Poster{ get; set; }//海报图片名
        public string Director{ get; set; }//导演名
        public string Actor{ get; set; }//演员
        public  MovieType MovieType { get; set; }
        //电影类型
        public int Price { get; set; }

    }
}
