import { Hero } from '../sections/Hero/Hero'
import { About } from '../sections/About/About'
import { Projects } from '../sections/Projects/Projects'
import { Experience } from '../sections/Experience/Experience'
import { Education } from '../sections/Education/Education'
import { Contact } from '../sections/Contact/Contact'

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Education />
      <Contact />
    </>
  )
}
