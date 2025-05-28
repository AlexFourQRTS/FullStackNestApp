import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Github, Linkedin, MapPin, Calendar } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative pt-16 pb-20 md:pb-32 flex content-center items-center justify-center min-h-[60vh] md:min-h-[75vh]">
        <div className="absolute top-0 w-full h-full bg-gradient-to-r from-orange-500/20 to-orange-600/20"></div>
        <div className="container relative mx-auto px-4">
          <div className="items-center flex flex-wrap">
            <div className="w-full lg:w-8/12 xl:w-6/12 px-4 ml-auto mr-auto text-center">
              <div className="md:pr-12">
                <h1 className="text-white font-semibold text-3xl md:text-4xl lg:text-5xl mb-4">
                  Обо мне
                </h1>
                <p className="mt-4 text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                  Добро пожаловать на мою личную страницу! Здесь вы можете узнать больше о моем опыте, навыках и проектах.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="pb-20 bg-gray-900/50 -mt-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">
            
            {/* Profile Card */}
            <div className="lg:pt-12 pt-6 w-full lg:w-4/12 px-4 mb-6 lg:mb-0">
              <Card className="bg-gray-800 border-gray-700 h-fit">
                <CardContent className="p-4 md:p-6">
                  <div className="text-center">
                    <div className="flex justify-center mb-6">
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl md:text-4xl font-bold">
                        👤
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-3">
                      [Ваше имя]
                    </h3>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-400 flex items-center justify-center">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span>[Ваш город]</span>
                      </div>
                      <div className="text-sm text-gray-400 flex items-center justify-center">
                        <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span>[Ваш возраст] лет</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bio & Skills */}
            <div className="w-full lg:w-8/12 px-4">
              <Card className="bg-gray-800 border-gray-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white">О себе</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    [Здесь будет ваш рассказ о себе - опыт, интересы, достижения]
                  </p>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="bg-gray-800 border-gray-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Навыки</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      JavaScript
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      React
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      Node.js
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      TypeScript
                    </Badge>
                    {/* Добавьте свои навыки */}
                  </div>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card className="bg-gray-800 border-gray-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Опыт работы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-2 border-orange-500 pl-4">
                      <h4 className="text-white font-semibold">[Должность]</h4>
                      <p className="text-orange-400">[Компания] • [Период]</p>
                      <p className="text-gray-300 mt-2">[Описание обязанностей]</p>
                    </div>
                    {/* Добавьте больше опыта */}
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Контакты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500/10 w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500/10 w-full">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                    <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500/10 w-full">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}