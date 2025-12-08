import { Layout } from '@/component/layout/Layout';
import { coachProfile } from '@/data/mockData';
import { Target, Heart, Zap, Users } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Discipline',
    description: 'Consistency beats intensity. We believe in building habits that last a lifetime.'
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'Fitness is not a chore—it\'s a lifestyle. We train because we love it.'
  },
  {
    icon: Zap,
    title: 'Excellence',
    description: 'Good enough is never enough. We push for greatness in every rep.'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We rise by lifting others. The Wouhouch family supports each other.'
  }
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-primary/10 to-background">
        <div className="container-tight px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-5xl md:text-7xl text-foreground mb-6">
              OUR <span className="text-primary">STORY</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              From a small gym in Casablanca to a movement that's transforming lives across Morocco.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-card">
        <div className="container-tight px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-video md:aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
              <span className="font-display text-8xl text-primary/20">W</span>
            </div>
            
            <div>
              <h2 className="font-display text-4xl text-foreground mb-6">
                THE <span className="text-primary">MISSION</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Wouhouch Hub was born from a simple belief: everyone deserves access to world-class fitness coaching. What started as Coach Yassine's passion project has grown into a comprehensive platform for transformation.
              </p>
              <p className="text-muted-foreground mb-6">
                We combine proven training methodologies with genuine care for every individual who walks through our doors—physical or digital. Whether you're joining a live event, following our online programs, or wearing our gear, you're part of a family committed to excellence.
              </p>
              <blockquote className="border-l-4 border-primary pl-4 italic text-foreground">
                "{coachProfile.philosophy}"
                <footer className="text-primary mt-2">— Coach Yassine</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-background">
        <div className="container-tight px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              OUR <span className="text-primary">VALUES</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at Wouhouch Hub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="p-6 rounded-xl bg-card border border-border text-center card-hover">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-card">
        <div className="container-tight px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(coachProfile.stats).map(([key, value]) => (
              <div key={key} className="text-center">
                <p className="font-display text-5xl md:text-6xl text-primary mb-2">{value}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coach */}
      <section className="section-padding bg-background">
        <div className="container-tight px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
                <span className="font-display text-4xl text-primary/30">YS</span>
              </div>
              
              <div className="md:col-span-2">
                <h2 className="font-display text-4xl text-foreground mb-2">
                  {coachProfile.name}
                </h2>
                <p className="text-primary font-medium mb-6">{coachProfile.title}</p>
                
                <p className="text-muted-foreground mb-6 whitespace-pre-line">
                  {coachProfile.bio}
                </p>
                
                <h3 className="font-display text-xl text-foreground mb-4">Certifications</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {coachProfile.certifications.map((cert, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
